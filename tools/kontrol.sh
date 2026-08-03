#!/bin/bash
# Hexis birlesik kontrol.
#
#   bash tools/kontrol.sh              # tum site + degisen Turkce sayfalarin uslubu
#   bash tools/kontrol.sh a.html b.html   # yalnizca verilen dosyalar
#
# Cikis kodu 0 ise yayina uygun. Pre-commit hook bu betigi cagirir.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

MAVI='\033[1;34m'; YESIL='\033[0;32m'; KIRMIZI='\033[0;31m'; SIFIR='\033[0m'
SONUC=0

if [ $# -gt 0 ]; then
  HEDEF=("$@")
else
  # degisen ve stage'lenmis HTML dosyalari; hicbiri yoksa tum site
  mapfile -t HEDEF < <(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep '\.html$' || true)
  if [ ${#HEDEF[@]} -eq 0 ]; then
    mapfile -t HEDEF < <(git diff --name-only --diff-filter=ACM 2>/dev/null | grep '\.html$' || true)
  fi
fi

echo -e "${MAVI}[1/2] Yapisal kontrol${SIFIR}"
python3 tools/site-kontrol.py || SONUC=1

echo
echo -e "${MAVI}[2/2] Turkce uslup kontrolu${SIFIR}"
TR=()
for f in "${HEDEF[@]:-}"; do
  [ -f "$f" ] || continue
  # yalnizca lang="tr" olan sayfalar olculur
  if head -3 "$f" | grep -q 'lang="tr"'; then TR+=("$f"); fi
done

if [ ${#TR[@]} -eq 0 ]; then
  echo "  Degisen Turkce sayfa yok, uslup kontrolu atlandi."
else
  python3 tools/uslup-kontrol.py "${TR[@]}" || SONUC=1
fi

echo
if [ $SONUC -eq 0 ]; then
  echo -e "${YESIL}KONTROL GECTI — yayina uygun${SIFIR}"
else
  echo -e "${KIRMIZI}KONTROL BASARISIZ — duzeltmeden commit etmeyin${SIFIR}"
  echo "Kurallar: CLAUDE.md ve uslup-rehberi.md"
fi
exit $SONUC
