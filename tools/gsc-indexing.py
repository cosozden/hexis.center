#!/usr/bin/env python3
"""
Google Search Console Indexing API — URL Submission Tool

hexis.center blog yazıları için Google'a hızlı indeksleme isteği gönderir.

Kurulum:
  1. Google Cloud Console → APIs & Services → Credentials
     → Service Account oluştur
     → JSON key indir → tools/gsc-service-account.json olarak kaydet
  2. Indexing API'yi etkinleştir:
     Google Cloud Console → APIs & Services → Library → "Indexing API" → Enable
  3. Service Account e-mail adresini GSC'ye ekle:
     Google Search Console → Settings → Users and permissions → Add user
     → Service Account e-mail → Owner yetkisi ver
  4. Bağımlılıkları kur:
     pip install google-auth google-auth-httplib2 google-api-python-client

Kullanım:
  python tools/gsc-indexing.py [URL]
  python tools/gsc-indexing.py --all-blog
  python tools/gsc-indexing.py --sitemap

Örnekler:
  python tools/gsc-indexing.py https://hexis.center/blog/etken-yapay-zeka-kisisel-verilere-etkisi/
  python tools/gsc-indexing.py --all-blog
"""

import sys
import os
import json
import glob
import xml.etree.ElementTree as ET

SITE_URL = "https://hexis.center"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_FILE = os.path.join(REPO_ROOT, "tools", "gsc-service-account.json")


def get_service():
    """Build authenticated Indexing API service."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("HATA: Google API bağımlılıkları eksik.")
        print("Kur: pip install google-auth google-auth-httplib2 google-api-python-client")
        sys.exit(1)

    if not os.path.isfile(KEY_FILE):
        print(f"HATA: Service account key bulunamadı: {KEY_FILE}")
        print()
        print("Kurulum adımları:")
        print("  1. Google Cloud Console → APIs & Services → Credentials")
        print("     → Create Service Account → JSON key indir")
        print(f"  2. Dosyayı buraya kaydet: {KEY_FILE}")
        print("  3. Google Search Console → Settings → Users and permissions")
        print("     → Service Account e-mail'ini Owner olarak ekle")
        sys.exit(1)

    SCOPES = ["https://www.googleapis.com/auth/indexing"]
    credentials = service_account.Credentials.from_service_account_file(
        KEY_FILE, scopes=SCOPES
    )
    return build("indexing", "v3", credentials=credentials)


def submit_url(service, url, action="URL_UPDATED"):
    """Submit a single URL for indexing."""
    body = {"url": url, "type": action}
    try:
        response = service.urlNotifications().publish(body=body).execute()
        print(f"  ✅ {url}")
        print(f"     Bildirim: {response.get('urlNotificationMetadata', {}).get('latestUpdate', {}).get('notifyTime', 'N/A')}")
        return True
    except Exception as e:
        print(f"  ❌ {url}: {e}")
        return False


def get_blog_urls():
    """Get all blog URLs from the blog directory."""
    pattern = os.path.join(REPO_ROOT, "blog", "*", "index.html")
    urls = []
    for path in sorted(glob.glob(pattern)):
        slug = os.path.basename(os.path.dirname(path))
        if slug.startswith("_"):
            continue
        urls.append(f"{SITE_URL}/blog/{slug}/")
    return urls


def get_sitemap_urls():
    """Get all URLs from sitemap.xml."""
    sitemap_path = os.path.join(REPO_ROOT, "sitemap.xml")
    if not os.path.isfile(sitemap_path):
        print(f"HATA: sitemap.xml bulunamadı: {sitemap_path}")
        return []

    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [url.find("sm:loc", ns).text for url in root.findall("sm:url", ns)]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    arg = sys.argv[1]

    service = get_service()

    if arg == "--all-blog":
        urls = get_blog_urls()
        print(f"Blog URL'leri gönderiliyor ({len(urls)} adet):\n")
    elif arg == "--sitemap":
        urls = get_sitemap_urls()
        print(f"Sitemap URL'leri gönderiliyor ({len(urls)} adet):\n")
    else:
        urls = [arg]
        print("URL gönderiliyor:\n")

    success = 0
    for url in urls:
        if submit_url(service, url):
            success += 1

    print(f"\nSonuç: {success}/{len(urls)} URL başarıyla gönderildi.")

    # Daily quota reminder
    print(f"\nNot: Indexing API günlük kotası: 200 URL/gün")


if __name__ == "__main__":
    main()
