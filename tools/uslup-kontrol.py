#!/usr/bin/env python3
"""
Hexis Turkce uslup kontrolu.
Kullanim: python3 tools/uslup-kontrol.py <dosya.html> [dosya2.html ...]

Olctugu seyler:
  1. Baglac dokusu     : oysa / ne var ki / ustelik ... kac kez gecmis
  2. Cumle ici tire    : em dash yasagi (CLAUDE.md, baglayici kural)
  3. Uydurma kelime    : cikarsamak vb.
  4. Ortalama cumle    : cok kisa = Ingiliz ritmi
  5. Ingilizce kalibi  : "sudur", "sey" dolgusu, "Bu ... dir" zinciri
"""
import re, sys, html, os

BAGLAC = ['oysa','ne var ki','zaten','üstelik','dahası','kaldı ki','nitekim','elbette',
          'bununla birlikte','hâlbuki','öte yandan','söz konusu','peki','görüldüğü',
          'bulunmaktadır','durumdadır','fayda var','gerekmektedir']
YASAK_KELIME = ['çıkarsa', 'çıkarsama']
KALIP = {
    '"şudur/şöyledir" kalıbı (İngilizce "the result of this is")': r'ş(u|öyle)(dur|dir)\b',
    '"şey" dolgu sözcüğü': r'\bşey\b',
    '"Bu/Bunun" ile başlayan cümle': None,
}

def metin(p):
    """Yalnizca duz paragraf metnini dondurur.
    Tablolar, alinti bloklari ve listeler olcume dahil edilmez; onlar veri, dusunce akisi degil."""
    s = open(p, encoding='utf-8', errors='ignore').read()
    i = s.find('<article')
    if i == -1: i = 0
    t = s[i:]
    for pat in [r'<(script|style).*?</\1>', r'<table.*?</table>',
                r'<div class="q-block".*?</div>\s*</div>', r'<ol.*?</ol>', r'<ul.*?</ul>']:
        t = re.sub(pat, ' ', t, flags=re.S)
    paras = re.findall(r'<p[^>]*>(.*?)</p>', t, re.S)
    t = ' '.join(re.sub(r'<[^>]+>', ' ', x) for x in paras)
    return re.sub(r'\s+', ' ', html.unescape(t))

def denetle(p):
    t = metin(p)
    c = [x.strip() for x in re.split(r'(?<=[.!?])\s+', t) if 25 < len(x.strip()) < 300]
    if not c:
        print(f"  {p}: metin bulunamadı"); return True
    ok = True
    print(f"\n=== {p} ===")
    print(f"  {len(c)} cümle, {len(t.split())} kelime")

    n = sum(len(re.findall(re.escape(w), t, re.I)) for w in BAGLAC)
    oran = n / len(c)
    durum = "✓" if oran >= 0.10 else "✗"
    if oran < 0.10: ok = False
    print(f"  {durum} bağlaç dokusu: {n} geçiş, cümle başına {oran:.2f}  (hedef ≥ 0.10)")
    if oran < 0.10:
        print("      Metin bağlaçsız akıyor. oysa / ne var ki / üstelik / nitekim ekleyin.")

    tire = t.count(' — ') + len(re.findall(r'[a-zçğıöşü] - [a-zçğıöşü]', t))
    if tire:
        ok = False
        print(f"  ✗ cümle içi tire: {tire}  (CLAUDE.md: sıfır olmalı)")
    else:
        print("  ✓ cümle içi tire: 0")

    for w in YASAK_KELIME:
        k = len(re.findall(w, t, re.I))
        if k:
            ok = False
            print(f"  ✗ yasak kelime '{w}': {k}  → 'çıkarım yapmak / sonucuna varmak'")

    ort = sum(len(x.split()) for x in c) / len(c)
    durum = "✓" if ort >= 14 else "✗"
    if ort < 14: ok = False
    print(f"  {durum} ortalama cümle: {ort:.1f} kelime  (hedef ≥ 14)")
    if ort < 14:
        print("      Cümleler kısa ve kesik. Noktalı virgülle bağlayın.")

    for ad, pat in KALIP.items():
        if pat is None:
            k = sum(1 for x in c if re.match(r'^(Bu|Bunun|Bunlar)\b', x))
        else:
            k = sum(1 for x in c if re.search(pat, x))
        pay = k / len(c)
        if pay > 0.06:
            ok = False
            print(f"  ✗ {ad}: {k} (%{round(100*pay)})")
    return ok

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    sonuc = all(denetle(p) for p in sys.argv[1:] if os.path.isfile(p))
    print("\n" + ("SONUÇ: GEÇTİ ✓" if sonuc else "SONUÇ: DÜZELTME GEREKİYOR ✗"))
    sys.exit(0 if sonuc else 1)
