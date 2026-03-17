# Google Search Console API — Kurulum Kılavuzu

hexis.center deploy sonrası otomatik indexleme için gerekli adımlar.

---

## 1. Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com) → proje seç (veya yeni oluştur)
2. **APIs & Services → Library** → "Web Search Indexing API" ara → **Enable**
3. **APIs & Services → Credentials → Create Credentials → Service Account**
   - Name: `hexis-gsc-indexing`
   - Role: gerekmiyor (boş bırak)
4. Oluşturulan service account'u tıkla → **Keys → Add Key → JSON**
5. İndirilen JSON dosyasını kaydet:
   ```
   hexis.center/checklist/gsc-credentials.json
   ```

> ⚠️ `gsc-credentials.json` dosyasını **asla git'e commit etme**.
> `.gitignore`'da zaten listelendi.

---

## 2. Search Console'da Yetkilendirme

1. [search.google.com/search-console](https://search.google.com/search-console) → hexis.center property'si
2. **Settings → Users and permissions → Add user**
3. Service account e-posta adresini ekle (JSON dosyasında `client_email` alanı)
4. Permission: **Owner** veya **Full** (indexing için gerekli)

---

## 3. Python Bağımlılıkları

```bash
pip install google-auth google-auth-httplib2 google-api-python-client
```

---

## 4. Test

```bash
# Dry-run — API'ye istek göndermez
python3 checklist/gsc-indexing.py --dry-run

# Gerçek test — bugünkü değişiklikleri gönder
python3 checklist/gsc-indexing.py

# Tek URL
python3 checklist/gsc-indexing.py --url https://hexis.center/generator/

# Belirli tarih
python3 checklist/gsc-indexing.py --date 2026-03-17
```

---

## 5. Ortam Değişkeni (opsiyonel)

JSON dosyasını farklı bir konumda tutmak istersen:

```bash
export GSC_CREDENTIALS_PATH="/path/to/gsc-credentials.json"
```

---

## Credentials olmadan çalışır mı?

Evet. Credentials yoksa script **dry-run moduna** geçer:
- Değişen URL'leri tespit eder
- `gsc-indexing-log.json`'a kaydeder
- Manuel indexleme için GSC linkini gösterir
