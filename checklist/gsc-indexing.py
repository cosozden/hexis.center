#!/usr/bin/env python3
"""
hexis.center — Google Search Console Indexing Script
=====================================================
Deploy sonrası değişen URL'leri Google'a bildirir.

Strateji (sırayla):
  1. Google Indexing API  — en hızlı, doğrudan URL bildirimi
  2. Search Console Sitemap API — sitemap yenileme (Indexing API başarısız olursa)
  3. IndexNow             — Bing/Yandex için (her zaman çalışır, credentials gerekmez)

Kullanım:
  python3 gsc-indexing.py                        # Bugün değişenleri indexle
  python3 gsc-indexing.py --date 2026-03-17      # Belirli tarih
  python3 gsc-indexing.py --url https://...      # Tek URL
  python3 gsc-indexing.py --dry-run              # Gönderme, sadece listele

Credentials:
  GSC_CREDENTIALS_PATH ortam değişkeni veya ./gsc-credentials.json
  Yoksa: IndexNow + sitemap ping ile devam eder.

Setup:
  pip install google-auth google-auth-httplib2 google-api-python-client requests
"""

import os
import sys
import json
import argparse
import subprocess
import urllib.request
import urllib.error
from datetime import date, datetime
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

SITE_URL    = "https://hexis.center/"
SITEMAP_URL = "https://hexis.center/sitemap.xml"
REPO_ROOT   = Path(__file__).parent.parent  # hexis.center/ root

# IndexNow key dosyası (repo root'ta hexis-indexnow-key.txt olarak sakla)
INDEXNOW_KEY_FILE = REPO_ROOT / "hexis-indexnow-key.txt"


# ── URL dönüşümü ──────────────────────────────────────────────────────────────

def file_to_url(file_path: str) -> str | None:
    """Git dosya yolunu hexis.center URL'ine dönüştür."""
    p = file_path.strip()

    if not p.endswith(".html") and not p.endswith(".xml"):
        return None

    skip_prefixes = ("assets/", "CLAUDE.md", "docs/", "_")
    if any(p.startswith(s) for s in skip_prefixes):
        return None

    # feed.xsl → atla (görsel dosya, indexlenmez)
    if p.endswith(".xsl"):
        return None

    if p.endswith("/index.html"):
        return SITE_URL + p[: -len("/index.html")] + "/"

    if p == "index.html":
        return SITE_URL

    if p.endswith(".html"):
        return SITE_URL + p

    # sitemap.xml değişmişse sitemap URL'ini döndür (özel durum)
    if p == "sitemap.xml":
        return None  # sitemap değişikliği URL bildirimine girmez, ping olarak ele alınır

    if p.endswith(".xml"):
        return SITE_URL + p

    return None


# ── Git ───────────────────────────────────────────────────────────────────────

def get_changed_files_today(target_date: date) -> list[str]:
    since = f"{target_date} 00:00:00"
    until = f"{target_date} 23:59:59"
    cmd = ["git", "log", f"--since={since}", f"--until={until}",
           "--name-only", "--pretty=format:"]
    try:
        result = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True, check=True)
        files = [line.strip() for line in result.stdout.splitlines() if line.strip()]
        return list(dict.fromkeys(files))
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] git log başarısız: {e}", file=sys.stderr)
        return []


def files_to_urls(files: list[str]) -> list[str]:
    urls = []
    for f in files:
        url = file_to_url(f)
        if url and url not in urls:
            urls.append(url)
    return urls


# ── Credentials ───────────────────────────────────────────────────────────────

def load_credentials(scopes=None):
    """Service account credentials yükle. Bulunamazsa None döner."""
    if scopes is None:
        scopes = ["https://www.googleapis.com/auth/webmasters",
                  "https://www.googleapis.com/auth/indexing"]

    cred_path = os.environ.get("GSC_CREDENTIALS_PATH", "")
    if not cred_path:
        default = Path(__file__).parent / "gsc-credentials.json"
        if default.exists():
            cred_path = str(default)

    if not cred_path or not Path(cred_path).exists():
        return None

    try:
        from google.oauth2 import service_account
        return service_account.Credentials.from_service_account_file(
            cred_path, scopes=scopes
        )
    except ImportError:
        print("[WARN] google-auth yüklü değil: pip install google-auth google-auth-httplib2 google-api-python-client")
        return None
    except Exception as e:
        print(f"[ERROR] Credentials yüklenemedi: {e}", file=sys.stderr)
        return None


# ── Strateji 1: Google Indexing API ──────────────────────────────────────────

def indexing_api(urls: list[str], creds) -> dict:
    """
    Google Indexing API ile URL bildir.
    NOT: Resmi olarak JobPosting/BroadcastEvent sayfaları için tasarlanmış.
    Genel sayfalar için 403 dönebilir — bu normal, fallback devreye girer.
    """
    try:
        import googleapiclient.discovery
        import googleapiclient.errors
        # Indexing API için ayrı credentials gerekiyor
        from google.oauth2 import service_account
        cred_path = os.environ.get("GSC_CREDENTIALS_PATH",
                        str(Path(__file__).parent / "gsc-credentials.json"))
        indexing_creds = service_account.Credentials.from_service_account_file(
            cred_path,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        service = googleapiclient.discovery.build(
            "indexing", "v3", credentials=indexing_creds,
            cache_discovery=False
        )
    except Exception as e:
        return {"method": "indexing_api", "status": "unavailable", "error": str(e)}

    results = []
    for url in urls:
        try:
            body = {"url": url, "type": "URL_UPDATED"}
            resp = service.urlNotifications().publish(body=body).execute()
            results.append({"url": url, "status": "ok", "response": resp})
        except Exception as e:
            err = str(e)
            results.append({"url": url, "status": "error", "error": err})

    success = sum(1 for r in results if r["status"] == "ok")
    return {
        "method": "indexing_api",
        "status": "ok" if success == len(urls) else ("partial" if success > 0 else "failed"),
        "results": results,
        "success": success,
        "total": len(urls),
    }


# ── Strateji 2: Search Console Sitemap API ───────────────────────────────────

def sitemap_ping(creds) -> dict:
    """
    Search Console Sitemap API ile sitemap yenile.
    Bu sayede Google tüm URL'leri yeniden tarar.
    """
    try:
        import googleapiclient.discovery
        service = googleapiclient.discovery.build(
            "searchconsole", "v1", credentials=creds,
            cache_discovery=False
        )
        # Sitemap'i yeniden gönder (Google'ı yeniden taramaya zorlar)
        service.sitemaps().submit(
            siteUrl=SITE_URL,
            feedpath=SITEMAP_URL
        ).execute()
        return {"method": "sitemap_api", "status": "ok", "sitemap": SITEMAP_URL}
    except Exception as e:
        return {"method": "sitemap_api", "status": "error", "error": str(e)}


# ── Strateji 3: IndexNow (Bing, Yandex, vb.) ─────────────────────────────────

def indexnow_ping(urls: list[str]) -> dict:
    """
    IndexNow protokolü ile URL bildir.
    Google desteklemiyor ama Bing/Yandex için çalışır.
    Key dosyası yoksa bu adımı atlar.
    """
    if not INDEXNOW_KEY_FILE.exists():
        return {"method": "indexnow", "status": "skipped",
                "reason": f"Key dosyası bulunamadı: {INDEXNOW_KEY_FILE.name}"}

    key = INDEXNOW_KEY_FILE.read_text().strip()
    payload = json.dumps({
        "host": "hexis.center",
        "key": key,
        "keyLocation": f"https://hexis.center/{key}.txt",
        "urlList": urls
    }).encode()

    endpoint = "https://api.indexnow.org/indexnow"
    req = urllib.request.Request(
        endpoint,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status_code = resp.status
            return {"method": "indexnow", "status": "ok",
                    "http_status": status_code, "urls_sent": len(urls)}
    except urllib.error.HTTPError as e:
        return {"method": "indexnow", "status": "error",
                "http_status": e.code, "error": str(e)}
    except Exception as e:
        return {"method": "indexnow", "status": "error", "error": str(e)}


# ── Strateji 4: Sitemap HTTP Ping ─────────────────────────────────────────────

def sitemap_http_ping() -> dict:
    """
    Eski usul sitemap ping — Bing Webmaster'a HTTP GET ile bildir.
    Credentials gerektirmez.
    """
    ping_url = f"https://www.bing.com/ping?sitemap={SITEMAP_URL}"
    req = urllib.request.Request(ping_url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return {"method": "sitemap_http_ping", "status": "ok",
                    "http_status": resp.status}
    except Exception as e:
        return {"method": "sitemap_http_ping", "status": "error", "error": str(e)}


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="hexis.center GSC Indexing — çok katmanlı indexleme"
    )
    parser.add_argument("--date", default=str(date.today()),
                        help="Tarih (YYYY-MM-DD), varsayılan: bugün")
    parser.add_argument("--url", help="Tek URL indexle")
    parser.add_argument("--dry-run", action="store_true",
                        help="API'ye gönderme, sadece listele")
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  hexis.center GSC Indexing — {args.date}")
    print(f"{'='*60}\n")

    # URL'leri belirle
    if args.url:
        urls = [args.url]
        changed_files = []
    else:
        target_date = datetime.strptime(args.date, "%Y-%m-%d").date()
        changed_files = get_changed_files_today(target_date)

        if not changed_files:
            print("✅ Bugün deploy yok, indexing gerekmiyor.\n")
            return 0

        urls = files_to_urls(changed_files)

        print(f"📁 Değişen dosyalar ({len(changed_files)}):")
        for f in changed_files:
            url = file_to_url(f)
            marker = "→ " + url if url else "⏭  (atlandı)"
            print(f"   {f:45s}  {marker}")

    if not urls:
        print("\n⏭  HTML değişikliği yok, indexing gerekmiyor.\n")
        return 0

    print(f"\n🔗 Indexlenecek URL'ler ({len(urls)}):")
    for url in urls:
        print(f"   {url}")

    if args.dry_run:
        print("\n⚠️  Dry-run modu — hiçbir istek gönderilmedi.\n")
        return 0

    # ── Çalıştır ──────────────────────────────────────────────────────────────
    all_results = []
    final_status = "failed"

    creds = load_credentials()

    # 1. Google Indexing API
    print("\n📡 [1/3] Google Indexing API deneniyor...")
    if creds:
        r1 = indexing_api(urls, creds)
        all_results.append(r1)
        if r1["status"] == "ok":
            print(f"   ✅ {r1['success']}/{r1['total']} URL gönderildi")
            final_status = "ok"
        elif r1["status"] == "partial":
            print(f"   ⚠️  {r1['success']}/{r1['total']} URL gönderildi (kısmi başarı)")
            final_status = "partial"
        else:
            err = r1.get("error", "") or (r1.get("results") or [{}])[-1].get("error", "")
            print(f"   ❌ Başarısız ({err[:80]})")
            if "403" in str(err):
                print("      → Indexing API yalnızca yapılandırılmış veri sayfaları için")
                print("        çalışır. Sitemap API'ye geçiliyor...")
    else:
        print("   ⏭  Credentials yok, bu adım atlandı.")
        all_results.append({"method": "indexing_api", "status": "skipped"})

    # 2. Sitemap API (credentials varsa ve Indexing API başarısız olduysa)
    if creds and final_status != "ok":
        print("\n📡 [2/3] Search Console Sitemap API deneniyor...")
        r2 = sitemap_ping(creds)
        all_results.append(r2)
        if r2["status"] == "ok":
            print(f"   ✅ Sitemap yenilendi: {r2['sitemap']}")
            print("      → Google sitemap'i yeniden işleyecek (24-48 saat)")
            final_status = "ok_sitemap"
        else:
            print(f"   ❌ Başarısız: {r2.get('error', '')[:80]}")
    else:
        print("\n⏭  [2/3] Sitemap API: atlandı")
        all_results.append({"method": "sitemap_api", "status": "skipped"})

    # 3. IndexNow (her zaman çalıştır — Bing/Yandex için)
    print("\n📡 [3/3] IndexNow (Bing/Yandex) deneniyor...")
    r3 = indexnow_ping(urls)
    all_results.append(r3)
    if r3["status"] == "ok":
        print(f"   ✅ {r3.get('urls_sent', len(urls))} URL gönderildi (Bing/Yandex)")
    elif r3["status"] == "skipped":
        print(f"   ⏭  {r3['reason']}")
        # Fallback: HTTP ping
        r3b = sitemap_http_ping()
        all_results.append(r3b)
        if r3b["status"] == "ok":
            print(f"   ✅ Sitemap HTTP ping başarılı (Bing)")
    else:
        print(f"   ❌ {r3.get('error', '')[:80]}")

    # ── Özet ──────────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    methods_ok = [r["method"] for r in all_results if r["status"] in ("ok", "ok_sitemap")]
    if methods_ok:
        print(f"  ✅ Başarılı: {', '.join(methods_ok)}")
        print(f"  📄 {len(urls)} URL bildirildi")
    else:
        print("  ⚠️  Tüm yöntemler başarısız veya atlandı")
        print("  → Manuel: https://search.google.com/search-console")
    print(f"{'='*60}\n")

    # Log
    log_path = Path(__file__).parent / "gsc-indexing-log.json"
    _append_log(log_path, {
        "date": args.date,
        "run_at": datetime.now().isoformat(),
        "urls": urls,
        "final_status": final_status if methods_ok else "all_failed",
        "methods": all_results,
    })

    return 0 if methods_ok else 1


def _append_log(log_path: Path, entry: dict):
    log = []
    if log_path.exists():
        try:
            log = json.loads(log_path.read_text())
        except Exception:
            log = []
    log.append(entry)
    log_path.write_text(json.dumps(log[-50:], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    sys.exit(main())
