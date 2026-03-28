# Observe Form v2 — Kesinleşen Yapı

## Grup 1 — Sistem Kimliği (Ne?)
| # | Soru | Tür | Durum | Yasal Dayanak |
|---|------|-----|-------|---------------|
| 1 | Sistem Adı | Text input | ✅ Var | Annex IV §1 |
| 2 | Sektör | Dropdown (8 seçenek) | ✅ Var | Art. 6(2) + Annex III |
| 7 | AI Bileşeni Tespiti (AI mi, otomasyon mu?) | Seçenek | ❌ Eklenecek | Art. 3(1) |

## Grup 2 — Bağlam (Nerede, kim için?)
| # | Soru | Tür | Durum | Yasal Dayanak |
|---|------|-----|-------|---------------|
| 3 | Kullanım Amacı (intended purpose) | Textarea | ✅ Var | Art. 3(12), Art. 13 |
| 6 | Kuruluş Rolü (Provider/Deployer/Distributor) | Seçenek | ❌ Eklenecek | Art. 3(3-8), Art. 16, 26 |
| 10 | AB Pazarı mı? | Evet/Hayır | ❌ Eklenecek | Art. 2 |

## Grup 3 — Etki Alanı (Kimi, nasıl etkiliyor?)
| # | Soru | Tür | Durum | Yasal Dayanak |
|---|------|-----|-------|---------------|
| 4 | Etkilenen Paydaşlar | Checkbox (9 seçenek) | ✅ Var | Art. 9(8), Art. 27 |
| 9 | Karar Otonomisi (otomatik/yarı/öneri) | 3 seçenek | ❌ Eklenecek | Art. 14, KVKK Md. 11(1)(g) |
| 8 | Kişisel Veri İşliyor mu? | Evet/Hayır | ❌ Eklenecek | Art. 10, KVKK Md. 5 |

## Grup 4 — Risk Sinyalleri (Ne ters gidebilir?)
| # | Soru | Tür | Durum | Yasal Dayanak |
|---|------|-----|-------|---------------|
| 5 | Öngörülebilir Kötüye Kullanım | Sektöre göre radyo butonları | ✅ Var | Art. 9(2)(b) |

## KVKK Bloğu (Opsiyonel toggle)
Toggle: "Bu sistem Türkiye'de kişisel veri işliyor mu?"
Evet → aşağıdaki sorular açılır, Hayır → değerlendirme dışı

| Soru | Tür | Yasal Dayanak |
|------|-----|---------------|
| Veri kategorisi (özel nitelikli dahil) | Checkbox | KVKK Md. 6 |
| Hukuki sebep | Dropdown | KVKK Md. 5 |
| VERBİS kaydı | Evet/Hayır/Bilmiyorum | KVKK Md. 16 |
| Veri sorumlusu kimliği | Text | KVKK Md. 10 |

## Evaluate'e Bırakılan
- Sistem versiyonu / yaşam döngüsü (Annex IV §1)
- Veri akışı girdi→çıktı (Annex IV §2, Art. 10) — AI System Card'a not düşülecek

## Notlar
- Tüm form bilingual (TR/EN)
- KVKK bloğu toggle ile açılır/kapanır
- Kişisel veri sorusu (8) ana formda kalır, KVKK detayları toggle'da
- AI değilse (soru 7) form erken sonlanabilir: "Bu sistem EU AI Act kapsamı dışında görünüyor" notu
